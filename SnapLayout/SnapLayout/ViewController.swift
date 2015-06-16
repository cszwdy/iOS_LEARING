//
//  ViewController.swift
//  SnapLayout
//
//  Created by Emiaostein on 6/11/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit
import SnapKit


class ViewController: UIViewController {
    
    let pannel = ToolsPannel()
    let bar = ToolsPannel()
    var changed = false
    
    var pannelDefaultConstraint: Constraint!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        view.addSubview(pannel)
        view.addSubview(bar)
        pannel.backgroundColor = UIColor.lightGrayColor()
        bar.backgroundColor = UIColor.darkGrayColor()
        
        pannel.setupPannelWithType(.font)
    }
    
    override func updateViewConstraints() {
        
        if !changed {
            pannel.snp_updateConstraints { (make) -> Void in
                
                make.height.equalTo(80).constraint
                make.left.bottom.right.equalTo(view)
            }
            
            bar.snp_updateConstraints { (make) -> Void in
                
                make.left.right.equalTo(pannel)
                make.height.equalTo(80)
                make.top.equalTo(pannel.snp_bottom)
            }
        } else {
            
            pannel.snp_updateConstraints { (make) -> Void in
                
                make.height.equalTo(80).constraint
                make.left.right.equalTo(view)
                make.bottom.equalTo(view.snp_bottom).offset(-80)
            }
        }

        super.updateViewConstraints()
    }
    
    
    override func touchesEnded(touches: Set<NSObject>, withEvent event: UIEvent) {
        
        changed = !changed
        
        pannel.setupPannelWithType(.font)
        self.view.setNeedsUpdateConstraints()
        UIView.animateWithDuration(0.5, animations: { () -> Void in
            self.view.layoutIfNeeded()
        })
        
    }

}


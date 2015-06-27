//
//  OverlayPresentationController.swift
//  
//
//  Created by Emiaostein on 6/25/15.
//
//

import UIKit

class OverlayPresentationController: UIPresentationController {
    
    let dimmingView = UIView(frame: CGRectZero)
    
    override func presentationTransitionWillBegin() {
        
        let aContainerView = containerView
        let aPresentedVC = presentedViewController
        
        dimmingView.frame = aContainerView.bounds
        dimmingView.alpha = 0
        dimmingView.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(0.5)
        
        aContainerView.insertSubview(dimmingView, atIndex: 0)
        
        presentedViewController.transitionCoordinator()?.animateAlongsideTransition({ (transitionCordimatortext) -> Void in
            
            UIView.animateWithDuration(0.5, animations: { () -> Void in
                self.dimmingView.alpha = 1
            })
            }, completion: nil)
    }
    
    override func dismissalTransitionWillBegin() {
        
        presentedViewController.transitionCoordinator()?.animateAlongsideTransition({ (transitionCordimatortext) -> Void in
            
            self.dimmingView.alpha = 0
        }, completion: nil)
        
    }
}
